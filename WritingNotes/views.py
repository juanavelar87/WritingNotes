import datetime
from json.decoder import JSONDecodeError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from .models import Tag, User
from .models import Note
import json


def index(request):
    if request.user.is_authenticated:
        users = User.objects.all()
        return render(request,"WritingNotes/index.html",{
            "users": users
        })
    else:
        return render(request,"WritingNotes/login.html")

def newnote(request):
    addnotes = Note.objects.all()
    return render(request,"WritingNotes/newnote.html",{
        "Addnotes": addnotes,
    })
    
def tags(request):
    tags = Tag.objects.filter(User=request.user)
    return JsonResponse([tag.serialize() for tag in tags], safe=False)

def typenote(request, type):
    if type == "Notes":
        no = list(Note.objects.all())
        wlist = []
        for n in no:
            if len(list(n.inside.all())) > 0:
                for f in list(n.inside.all()):
                    wlist.append(f.id)
        notes = Note.objects.filter(User=request.user).exclude(id__in= wlist).filter(nexttime__isnull=True)
    elif type == "Public":
        notes = Note.objects.filter(public=True)
    elif type=="All":
        notes = Note.objects.filter(User=request.user)
    elif type == "Relevant":
        notes = Note.objects.filter(
        relevant=True,
        User=request.user
        )
    elif type == "Flashcards":
        notes = Note.objects.exclude(nexttime__isnull=True)
        notes = notes.order_by("-RevisionDate").filter(User=request.user)
        nowdate = datetime.date.today()
        u = 0
        notes = list(notes)
        for i in range(len(notes)):
            nextdate = datetime.datetime.strptime(notes[i-u].RevisionDate,"%d %m %Y").date()
            print(nextdate)
            print(nowdate)
            print(notes[i-u])
            print(nextdate>nowdate)
            if nextdate>nowdate:
                del notes[i-u]
                u+=1
        return JsonResponse([note.serialize() for note in notes], safe=False)
    else:
        return JsonResponse({"error": "Invalid."}, status=400)
    notes = notes.order_by("-lastmodified").all()
    return JsonResponse([note.serialize() for note in notes], safe=False)


@login_required
@csrf_exempt
def edit(request,id, change):
    if  request.method == "GET" and change == "note":
        notes = Note.objects.get(id=int(id))
        return JsonResponse(notes.serialize(), safe=False)
    elif request.method == "PUT":
        user = request.user
        data = json.loads(request.body)
        try:
            note = Note.objects.get(id=id, User = user)
        except Note.DoesNotExist: 
            return JsonResponse({
                "error": "Invalid Note, Doesn't Exist."
            }, status=404)
        if change== "title" and data.get("title") is not None:
            note.title = data["title"]
        elif change=="body" and data.get("body") is not None:
            note.body = data["body"]
        elif change=="color" and data.get("color") is not None:
            note.color = data["color"]
        elif change=="inside" and data.get("inside") is not None:
            try:
                note.inside.add(Note.objects.get(id=int(data.get("inside"))))
            finally:
                pass
        elif change=="relevant"and data.get("relevant") is not None:
            note.relevant =  data["relevant"]
        elif change=="takeoff"and data.get("takeout") is not None:
            try:
                note.inside.remove(Note.objects.get(id=int(data.get("takeout"))))
            finally:
                pass
        elif change=="nexttime"and data.get("nexttime") is not None:
            note.nexttime =  data["nexttime"]
            note.RevisionDate = note.SetDate(data["nexttime"])
        elif change=="public"and data.get("public") is not None:
            note.public =  data["public"]
        elif change=="tag" and data.get("tag") is not None:
            try:
                note.Tag.add(Tag.objects.get(name=data.get("tag")))
            finally:
                JsonResponse({
                "error": "Something."
            }, status=500)
        note.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@csrf_exempt
@login_required
def eliminate(request,id):
    try:
        note= Note.objects.get(id=id, User=request.user)
        note.delete()
    finally:
        pass
@csrf_exempt
@login_required
def new(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    # Check recipient emails
    try:
        data = json.loads(request.body)
        title = data.get("title", "")
        body = data.get("body", "")
        if data.get("type","")=="note":
            note = Note(
                User=request.user,
                title=title,
                body=body,
            )
            note.save()
            return JsonResponse({"message": "Created successfully"}, status=201)
        elif data.get("type","")=="tag":
            tag = Tag(
                User=request.user,
                name=title,
                color=body,
            )
            tag.save()
            return JsonResponse({"message": "Created successfully"}, status=201)
        elif data.get("type","")=="flash":
            date = datetime.date.today().strftime("%d %m %Y")
            flashcard = Note(
                User=request.user,
                title=title,
                body=body,
                nexttime=0,
                RevisionDate = date
            )
            flashcard.save()
            return JsonResponse({"message": "Created successfully"}, status=201)
    except JSONDecodeError:
        title= request.POST["title"]
        body = request.POST["body"]
        color = request.POST["color"]
        relevant = False
        if len(request.POST.getlist("relevant"))>0:
            if request.POST.getlist("relevant")[0]:
                relevant = True
        note = Note(
            User=request.user,
            title=title,
            body=body,
            color= color,
            relevant=relevant
            )
        note.save()
        return HttpResponseRedirect(reverse("index"))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "WritingNotes/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "WritingNotes/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["firstname"]
        last_name = request.POST["lastname"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "WritingNotes/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password,first_name=first_name,last_name=last_name)
            user.save()
        except IntegrityError:
            return render(request, "WritingNotes/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "WritingNotes/register.html")

