package io.ioak.expenso.application.category;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "category")
public class Category {

    private String id;
    private String name;
}
