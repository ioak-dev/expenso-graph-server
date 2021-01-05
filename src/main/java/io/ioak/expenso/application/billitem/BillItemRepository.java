package io.ioak.expenso.application.billitem;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BillItemRepository extends MongoRepository<BillItem, String> {
    List<BillItem> findAllByBillNumber(String billNumber);

}
