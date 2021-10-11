from django.contrib import admin
from .models import User
from .models import Note
from .models import Tag

admin.site.register(User)
admin.site.register(Note)
admin.site.register(Tag)
