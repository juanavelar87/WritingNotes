# Generated by Django 3.1.5 on 2021-06-28 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('WritingNotes', '0017_auto_20210608_1807'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='RevisionDate',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
