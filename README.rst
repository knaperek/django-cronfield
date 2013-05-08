=====
Cronfield
=====

Simple CRON field providing nice javascript-enabled User Interface and Cron format validation.


Quick start
-----------

1. Add "cronfield" to your INSTALLED_APPS setting like this::

      INSTALLED_APPS = (
          ...
          'cronfield',
      )

2. Use CronField in your models.py::

      from cronfield.models import CronField
      ...

      CRON_string = CronField()


3. Look at your model in the Django Admin interface (edit model page)
