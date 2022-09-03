from django.urls import path
from .views import *

urlpatterns = [
    path('', BillingView.as_view(), name='billing'),
    path('report/', ReportView.as_view(), name='report'),
    path('get-product-by-category/<int:id>', get_product_by_category, name='get-product-by-category'),
    path('add-item-to-order-item/<slug>', add_item_to_order_item, name='add-item-to-order-item'),
    path('remove-item-from-order-item/<slug>', remove_item_from_order_item, name='remove-item-from-order-item'),
    path('save-order-items', save_order_items, name='save-order-items'),

    path('orders', OrdersView.as_view(), name='orders'),
    path('order/delete/<int:id>', delete_order, name='delete_order'),
    path('order/edit/<int:id>', edit_order, name='edit_order'),
    
    path('edit-get-product-by-category/<int:order_id>/<int:id>', edit_get_product_by_category, name='edit-get-product-by-category'),
    path('edit-add-item-to-order-item/<int:order_id>/<slug>', edit_add_item_to_order_item, name='edit-add-item-to-order-item'),
    path('edit-remove-item-from-order-item/<int:order_id>/<slug>', edit_remove_item_from_order_item, name='edit-remove-item-from-order-item'),
    path('edit-save-order-items/<int:order_id>', edit_save_order_items, name='edit-save-order-items'),
    
    path('get-order-report/<int:id>', get_order_report, name="get-order-report"),
    path('update-payment/<int:id>', update_payment, name="update-payment"),

    path('sales-return/', SalesReturnView.as_view(), name="view_sales_return"),
    path('sales-return/<int:id>', sales_return, name='sales_return'),
    path('sales-return-report/', SalesReturnReportView.as_view(), name="view_sales_return_report"),

    path('add-note/<int:id>', add_note, name="add_note"),
    path('edit-add-note/<int:order_id>/<int:id>', edit_add_note, name="edit_add_note"),
    
    path('total-report/<str:report_type>', TotalReportView.as_view(), name='total_report'),
    path('product-report/<str:product_url>/<str:report_type>', ProductReportView.as_view(), name='product_report'),
    
    path('search-category-all/', search_category_all, name="search_category_all"),
    path('search-category/<query>', search_category, name="search_category"),
]
