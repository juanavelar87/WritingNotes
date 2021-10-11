from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE, PROTECT, RESTRICT
from django.db.models.fields import CharField
from django.db.models.fields.related import ManyToManyField
import datetime

class User(AbstractUser):
    pass
 
class Tag(models.Model):
    User = models.ForeignKey(User, on_delete=CASCADE, related_name="TagsfromUser")
    name = models.CharField(max_length=40)
    color = models.CharField(max_length=30,blank=True, null=True, default="rgb(224, 224, 224)") 
    def serialize(self):
        return {
            "name": self.name,
            "color": self.color,
            }

class Note(models.Model):
    User = models.ForeignKey(User, on_delete=CASCADE, related_name="UserNote")
    title = models.CharField(max_length=50, default=f"Note")
    body = models.TextField(blank=True, null=True)
    lastmodified = models.DateTimeField(auto_now=True)
    started = models.DateTimeField(auto_now_add=True)
    public = models.BooleanField(default=False)
    relevant = models.BooleanField(default=False)
    inside = models.ManyToManyField("Note", blank=True)
    Tag = models.ManyToManyField(Tag, blank=True)
    nexttime = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=30, default="rgb(224, 224, 224)") 
    RevisionDate = models.CharField(max_length=32,blank=True, null=True)

    def __str__(self):
        return f"{self.User} Note: {self.title}"
 
    def SetDate(self,nexttime):
        if self.RevisionDate:
            date =datetime.datetime.strptime(self.RevisionDate,"%d %m %Y")
            newdate = date+datetime.timedelta(days=nexttime)
            return newdate.date().strftime("%d %m %Y")
        else:
            print("Happened")
            return None
    def serialize(self):
        listnotes = list(self.inside.all())
        if len(listnotes)>0: 
            inside = []
            for note in listnotes: 
                inside.append(note.serialize())
        else: 
            inside=False
        nexttime = False
        if self.nexttime is not None:
            nexttime = self.nexttime
        if len(list(self.Tag.all()))>0: 
            tags = []
            for note in list(self.Tag.all()): 
                tags.append(note.name)
        else: 
            tags=False
        nextdate = False
        if self.RevisionDate is not None:
            nextdate = datetime.datetime.strptime(self.RevisionDate,"%d %m %Y").strftime("%d %m %Y")
        return {
            "id": self.id,
            "user": self.User.username,
            "public":self.public,
            "title": self.title,
            "body": self.body,
            "started": self.started.strftime("%b %d %Y, %I:%M %p"),
            "lastmodified": self.lastmodified.strftime("%b %d %Y, %I:%M %p"),
            "nexttime": nexttime,
            "relevant": self.relevant,
            "nextdate":nextdate,
            "inside": inside,
            "tag":tags,
            "color":self.color,            
}

