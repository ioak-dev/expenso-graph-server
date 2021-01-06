package io.ioak.expenso.application.category;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface CategoryRepository extends MongoRepository<Category, String> {
    Category findByName(String name);

}
