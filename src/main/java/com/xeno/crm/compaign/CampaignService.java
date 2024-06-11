package com.xeno.crm.compaign;

import com.xeno.crm.communications.CommunicationLog;
import com.xeno.crm.communications.CommunicationLogRepository;
import com.xeno.crm.communications.DeliveryService;
import com.xeno.crm.customers.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private CommunicationLogRepository logRepository;

    @Autowired
    private DeliveryService deliveryService;

    public Campaign createCampaign(Campaign campaign) {
        campaign.setDate(LocalDateTime.now());
        campaignRepository.save(campaign);
        List<CommunicationLog> logs = new ArrayList<>();
        for (Customer customer : campaign.getCustomers()) {
            CommunicationLog log = new CommunicationLog();
            log.setRecipient(customer.getEmail());
            log.setSubject(campaign.getSubject());
            log.setBody(campaign.getBody() == null ? null : campaign.getBody().replaceAll("\\{customer}", customer.getName()));
            log.setStatus(CommunicationLog.Status.PENDING);
            log.setCampaign(campaign);
            logs.add(log);
        }
        logRepository.saveAll(logs);//batch save
        deliveryService.deliverMessage(logs);
        return campaign;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }
}
