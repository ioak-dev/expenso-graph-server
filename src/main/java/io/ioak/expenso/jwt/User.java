package io.ioak.expenso.jwt;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private String id;
    private String reference;
    private String firstName;
    private String lastName;
    private String email;

}
