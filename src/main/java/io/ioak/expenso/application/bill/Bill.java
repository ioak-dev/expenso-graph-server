package io.ioak.expenso.application.bill;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "bill")
public class Bill {

    private String id;
    private String billNumber;
    private String date;
    private Long amount;
}
