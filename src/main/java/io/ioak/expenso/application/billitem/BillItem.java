package io.ioak.expenso.application.billitem;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Setter
@Getter
@NoArgsConstructor
@Document(collection = "billitem")
public class BillItem {

    private String id;
    private String billNumber;
    private String categoryId;
    private String description;
    private Long amount;
}
