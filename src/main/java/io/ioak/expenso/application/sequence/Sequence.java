package io.ioak.expenso.application.sequence;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "sequence")
public class Sequence {

    private String id;
    private String field;
    private String context;
    private int nextVal;
    private int factor;
}
