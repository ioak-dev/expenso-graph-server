package io.ioak.expenso.application.sequence;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SequenceRepository extends MongoRepository<Sequence, String> {
    Sequence findFirstByFieldAndContext(String field, String context);
}
