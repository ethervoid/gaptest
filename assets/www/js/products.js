function create_products_list(data) {
    var products = data.results;
    $.each(products, function (index, product) {
        $('#products_list').append('<li><a href="product_detail.html?id=' + product.id + '" data-icon="arrow-r">' +
            '<img src="http://m.supertruper.com/api/v1/images/product/' + product.imageId + '"/>' +
            '<h4>' + product.productName + '</h4></a></li>');
    });
    $('#products_list').listview('refresh');
};

function create_product_detail(data) {
    var product_detail = data.results[0];
    console.log(product_detail);
    $('#product_detail').append('<div><img src="' + product_detail.imageUrl + '" /></div>');
};
