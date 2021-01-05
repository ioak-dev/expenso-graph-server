package io.ioak.expenso.application.project;

import io.ioak.expenso.application.email.EmailServer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
    Project findByReference(String reference);
}
