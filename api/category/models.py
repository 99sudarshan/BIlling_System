from django.db import models
from django.utils.safestring import mark_safe
from django.utils.text import slugify
from ckeditor.fields import RichTextField

# Create your models here.
STATUS = (
    (1,"Active"),
    (0,"Inactive")
)

class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.IntegerField(choices=STATUS, default=1)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        
    def get_products(self):
        return Product.objects.filter(category__name=self.name)
        
class Product(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)
    price = models.FloatField()
    description = RichTextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    image = models.ImageField()
    status = models.IntegerField(choices=STATUS, default=1)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Products"
        
    def image_tag(self):
        return mark_safe(f'<img src="{self.image.url}" width="50" height="50" />')

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Product, self).save(*args, **kwargs)
