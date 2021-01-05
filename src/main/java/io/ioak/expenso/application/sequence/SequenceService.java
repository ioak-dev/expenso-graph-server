package io.ioak.expenso.application.sequence;

import io.ioak.expenso.application.asset.Asset;
import io.ioak.expenso.application.asset.AssetRepository;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@Slf4j
public class SequenceService {

    @Autowired
    private SequenceRepository repository;

    public int nextVal(String field, String context) {
        Sequence sequence = repository.findFirstByFieldAndContext(field, context);
        if (sequence == null) {
            return 0;
        }
        int nextVal = sequence.getNextVal();
        sequence.setNextVal(nextVal + sequence.getFactor());
        repository.save(sequence);
        return nextVal;
    }

    public int nextVal(String field) {
        Sequence sequence = repository.findFirstByFieldAndContext(field, "na");
        if (sequence == null) {
            return 0;
        }
        int nextVal = sequence.getNextVal();
        sequence.setNextVal(nextVal + sequence.getFactor());
        repository.save(sequence);
        return nextVal;
    }

}
