package io.ioak.expenso.application.template;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TemplateRepository extends MongoRepository<Template, String> {
    List<Template> findAllByProjectId(String projectId);
}
