package io.ioak.expenso.space;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpaceRepository extends MongoRepository<Space, String> {
    Optional<Space> findByName(String name);
}
