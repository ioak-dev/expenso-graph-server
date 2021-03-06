package io.ioak.expenso.application.project;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@NoArgsConstructor
@Document(collection = "project")
public class Project {

    private String id;
    private String name;
    private String reference;
    private String description;
}
