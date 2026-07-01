from django.shortcuts import render
from .models import Product

def product_list(request):
    products = Product.objects.prefetch_related('inventory_set')
    return render(request, 'products/product_list.html', {'products': products})
