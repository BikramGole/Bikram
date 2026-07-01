from django.shortcuts import render
from django.http import JsonResponse
from .models import Product

def product_list(request):
    """
    View to list products with their inventory counts.
    Fixed N+1 query by prefetching related inventory.
    """
    products = Product.objects.prefetch_related('inventory_set').all()
    data = []
    for product in products:
        total_stock = sum(inv.quantity for inv in product.inventory_set.all())
        data.append({
            'id': product.id,
            'name': product.name,
            'stock': total_stock
        })
    return JsonResponse(data, safe=False)
