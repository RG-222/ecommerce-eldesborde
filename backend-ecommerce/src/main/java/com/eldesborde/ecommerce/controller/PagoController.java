package com.eldesborde.ecommerce.controller;

import cl.transbank.webpay.webpayplus.WebpayPlus;
import cl.transbank.webpay.webpayplus.responses.WebpayPlusTransactionCreateResponse;

import com.eldesborde.ecommerce.model.Orden;
import com.eldesborde.ecommerce.repository.OrdenRepository;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ecommerce-eldesborde.vercel.app"
})
public class PagoController {

    private final OrdenRepository ordenRepo;

    public PagoController(OrdenRepository ordenRepo) {
        this.ordenRepo = ordenRepo;
    }

    @PostMapping("/crear")
    public Map<String, String> crearPago(
            @RequestParam Long ordenId,
            @RequestParam Double monto
    ) throws Exception {

        Orden orden = ordenRepo.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        if (!"PENDIENTE".equals(orden.getEstado())) {
            throw new RuntimeException("Orden inválida para pago");
        }

        String buyOrder = "ORD" + ordenId;
        String sessionId = UUID.randomUUID().toString().substring(0, 20);

        String returnUrl = "https://ecommerce-eldesborde.vercel.app/pago-exitoso";

        WebpayPlus.Transaction tx = new WebpayPlus.Transaction();

        WebpayPlusTransactionCreateResponse response =
                tx.create(buyOrder, sessionId, monto, returnUrl);

        return Map.of(
                "url", response.getUrl(),
                "token", response.getToken()
        );
    }

    @PostMapping("/confirmar")
    public Map<String, Object> confirmarPago(@RequestBody Map<String, String> body) throws Exception {

        String token_ws = body.get("token_ws");

        WebpayPlus.Transaction tx = new WebpayPlus.Transaction();
        var response = tx.commit(token_ws);

        String buyOrder = response.getBuyOrder();
        Long ordenId = Long.parseLong(buyOrder.replace("ORD", ""));

        Orden orden = ordenRepo.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        orden.setEstado("AUTHORIZED".equals(response.getStatus())
                ? "PAGADO"
                : "CANCELADO");

        ordenRepo.save(orden);

        return Map.of(
                "status", response.getStatus(),
                "ordenId", orden.getId()
        );
    }
}