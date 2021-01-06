package io.ioak.expenso.application.billitem;

import io.ioak.expenso.application.asset.Asset;
import io.ioak.expenso.application.bill.Bill;
import io.ioak.expenso.application.bill.BillRepository;
import io.ioak.expenso.application.category.Category;
import io.ioak.expenso.application.category.CategoryRepository;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/space/{spaceId}/billitem")
@Slf4j
public class BillItemController {

    @Autowired
    private BillItemRepository repository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @ApiOperation(value = "view list of billitem",response = Asset.class)
    @GetMapping("/billnumber/{billNumber}")
    public ResponseEntity<List<BillItem>> getByBillNumber(@PathVariable String billNumber) {
        return ResponseEntity.ok(repository.findAllByBillNumber(billNumber));
    }

    @ApiOperation(value = "Create and update an billitem",response = Asset.class)
    @PostMapping("/billnumber/{billNumber}/date/{date}")
    public ResponseEntity<BillItem> create(@PathVariable String billNumber,
                                        @PathVariable String date,
                                        @RequestBody BillItem billItem) {
        Bill existingBill = billRepository.findByBillNumber(billNumber);
        if(existingBill != null) {
            existingBill.setDate(date);
            existingBill.setAmount(existingBill.getAmount()+billItem.getAmount());
            billRepository.save(existingBill);
        } else {
            Bill bill = new Bill();
            bill.setBillNumber(billNumber);
            bill.setDate(date);
            bill.setAmount(billItem.getAmount());
            billRepository.save(bill);
        }

        Category category = categoryRepository.findByName(billItem.getCategoryId());
        if(category != null){
            billItem.setCategoryId(category.getId());
        }else{
            Category newCategory = new Category();
            newCategory.setName(billItem.getCategoryId());
            newCategory = categoryRepository.save(newCategory);
            billItem.setCategoryId(newCategory.getId());
        }
        return ResponseEntity.ok(repository.save(billItem));
    }

    @ApiOperation(value = "Delete billitem by Id",response = Asset.class)
    @DeleteMapping(value = "/id")
    public void deleteById(@PathVariable String id) {
        repository.deleteById(id);
    }
}
