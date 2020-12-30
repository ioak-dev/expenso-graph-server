package io.ioak.expenso.application.asset;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "asset")
public class Asset {

    private String id;
    private String name;
    private String reference;
    private int assetId;
    private String description;
}
