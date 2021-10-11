from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("new", views.new, name="new"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("NewNote", views.newnote, name="New note"),
    path("Tag", views.tags, name="tags"),
    path("Eliminate/<int:id>", views.eliminate, name="tags"),
    path("Notes/<str:change>/<int:id>", views.edit, name="Edit"),
    path("Notes/<str:type>", views.typenote, name="Notes"),
]
