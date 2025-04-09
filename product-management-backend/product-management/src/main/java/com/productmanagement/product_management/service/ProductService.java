package com.productmanagement.product_management.service;

import com.productmanagement.product_management.entity.Product;
import com.productmanagement.product_management.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // Get product by ID
    public Product getProductById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Save product (including category, description, etc.)
    public Product save(Product product) {
        return repo.save(product);  // It will save the product including category and other fields
    }

    // Update an existing product
    public Product updateProduct(Long id, Product product) {
        Optional<Product> existingProductOpt = repo.findById(id);

        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setRating(product.getRating());
            existingProduct.setCategory(product.getCategory());  // Update category field

            return repo.save(existingProduct);  // Save and return updated product
        }
        return null;  // Return null if product not found
    }
    public List<Product> filterProducts(String category, Double minPrice, Double maxPrice, Double minRating, Double maxRating) {
        return repo.filterProducts(category, minPrice, maxPrice, minRating, maxRating);
    }


    // Delete product
    public boolean deleteProduct(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
