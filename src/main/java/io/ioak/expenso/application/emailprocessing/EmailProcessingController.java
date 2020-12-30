package io.ioak.expenso.application.emailprocessing;


import io.ioak.expenso.application.email.EmailServer;
import io.ioak.expenso.application.email.EmailServerRepository;
import io.ioak.expenso.application.template.Template;
import io.ioak.expenso.config.MailProcessor;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mail/{spaceId}")
@Slf4j
public class EmailProcessingController {

    @Autowired
    private MailProcessor mailProcessor;

    @Autowired
    private EmailServerRepository emailServerRepository;

    @ApiOperation(value = "Create and update a EmailConfig",response = Template.class)
    @PostMapping("/{projectReference}/{emailConfigReference}")
    public ResponseEntity<?> sendMail(@PathVariable String projectReference,
                                      @PathVariable String emailConfigReference) {
        EmailServer emailServer = emailServerRepository.findByReference(emailConfigReference);
        return ResponseEntity.ok("");
    }

    @ApiOperation(value = "Create and update a EmailConfig",response = Template.class)
    @PostMapping("/{projectReference}/{emailConfigReference}/{templatereference}")
    public ResponseEntity<?> sendMailWithTemplate(@PathVariable String projectReference,
                                                  @PathVariable String emailConfigReference,
                                                  @PathVariable String templatereference) {

        return ResponseEntity.ok("");
    }
}
