package io.ioak.expenso.application.email;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EmailServerRepository extends MongoRepository<EmailServer, String> {
        List<EmailServer> findAllByProjectId(String projectId);

        EmailServer findByReference(String reference);
}
