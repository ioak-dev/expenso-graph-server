package io.ioak.expenso.application.bill;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BillRepository extends MongoRepository<Bill, String> {
        Bill findByBillNumber(String billNumber);
}
