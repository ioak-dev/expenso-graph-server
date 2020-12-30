package io.ioak.expenso.application.asset;

import io.ioak.expenso.application.sequence.SequenceService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asset")
@Slf4j
public class AssetController {

    @Autowired
    private AssetRepository repository;

    @Autowired
    private SequenceService sequenceService;

    @ApiOperation(value = "view list of assets",response = Asset.class)
    @GetMapping
    public ResponseEntity<List<Asset>> get() {
        return ResponseEntity.ok(repository.findAll());
    }

    @ApiOperation(value = "view list of asset",response = Asset.class)
    @GetMapping("/id/{id}")
    public ResponseEntity<Asset> getById(@PathVariable String id) {
        return ResponseEntity.ok(repository.findById(id).get());
    }


    @ApiOperation(value = "Create and update an asset",response = Asset.class)
    @PutMapping
    public ResponseEntity<Asset> update(@RequestBody Asset request) {
        if (request.getAssetId() == 0) {
            request.setAssetId(sequenceService.nextVal("assetId"));
        }
        return ResponseEntity.ok(repository.save(request));
    }

    @ApiOperation(value = "Delete asset by Id",response = Asset.class)
    @DeleteMapping(value = "/id")
    public void deleteById(@PathVariable String id) {
        repository.deleteById(id);
    }
}
