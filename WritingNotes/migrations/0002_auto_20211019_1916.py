# Generated by Django 3.1.5 on 2021-10-19 19:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('WritingNotes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='Tag',
            field=models.ManyToManyField(blank=True, to='WritingNotes.Tag'),
        ),
        migrations.AddField(
            model_name='note',
            name='User',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, related_name='UserNote', to='WritingNotes.user'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='note',
            name='inside',
            field=models.ManyToManyField(blank=True, to='WritingNotes.Note'),
        ),
        migrations.AddField(
            model_name='tag',
            name='User',
            field=models.ForeignKey(default=-1, on_delete=django.db.models.deletion.CASCADE, related_name='TagsfromUser', to='WritingNotes.user'),
            preserve_default=False,
        ),
    ]