package com.xeno.crm.communications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DeliveryService {

    @Autowired
    private CommunicationLogRepository logRepository;

    public void deliverMessage(List<CommunicationLog> logs) {
        for (CommunicationLog log : logs) {
            deliverMessage(log);
        }
    }

    public void deliverMessage(CommunicationLog log) {
        //hit delivery receipt api here and update log
        try {
            tryDeliverMessage();
            log.setStatus(CommunicationLog.Status.SENT);
        } catch (Exception e) {
            log.setStatus(CommunicationLog.Status.FAILED);
        }
        logRepository.save(log);
    }

    private void tryDeliverMessage() throws Exception {
        if (new Random().nextInt(0, 10) == 0) {
            throw new Exception("Delivery API returned failed status");
        }
    }
}
