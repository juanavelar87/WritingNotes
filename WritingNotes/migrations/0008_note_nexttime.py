# Generated by Django 3.1.5 on 2021-05-19 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('WritingNotes', '0007_auto_20210519_1135'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='nexttime',
            field=models.DateField(blank=True, null=True),
        ),
    ]
