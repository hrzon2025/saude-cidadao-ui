package com.saudecidadao.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import android.util.Log;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configuração específica para Android 15 e superiores
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            setupAndroid15Layout();
        } else {
            // Para versões anteriores ao Android 15
            setupLegacyLayout();
        }
    }

    private void setupAndroid15Layout() {
        Window window = getWindow();
        
        // Desabilita edge-to-edge completamente no Android 15
        WindowCompat.setDecorFitsSystemWindows(window, true);
        
        // Força cores PRETAS nas system bars
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);
        
        // Garante que as barras sejam escuras
        View decorView = window.getDecorView();
        int flags = decorView.getSystemUiVisibility();
        // Remove light status bar e navigation bar flags se existirem
        flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        decorView.setSystemUiVisibility(flags);
        
        // Remove qualquer padding que possa ter sido adicionado
        View webView = getBridge().getWebView();
        if (webView != null) {
            webView.setPadding(0, 0, 0, 0);
            ViewCompat.setOnApplyWindowInsetsListener(webView, null);
        }
    }

    private void setupLegacyLayout() {
        // Configuração para Android 14 e anteriores
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, true);
        
        // Também força cores pretas nas versões anteriores
        window.setStatusBarColor(Color.BLACK);
        window.setNavigationBarColor(Color.BLACK);
        
        View webView = getBridge().getWebView();
        if (webView != null) {
            webView.setPadding(0, 0, 0, 0);
        }
    }

    @Override
    public void onBackPressed() {
        Log.d(TAG, "Botão de voltar pressionado");
        
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            
            // Verifica se há histórico no WebView
            if (webView.canGoBack()) {
                Log.d(TAG, "Há histórico - navegando para página anterior");
                webView.goBack();
                return;
            }
            
            // Se não há histórico, exibe confirmação para sair
            Log.d(TAG, "Sem histórico - exibindo confirmação para sair");
            String confirmJs = 
                "if (confirm('Deseja sair do aplicativo?')) { " +
                "  'exit'; " +
                "} else { " +
                "  'cancel'; " +
                "}";
            
            webView.evaluateJavascript(confirmJs, result -> {
                String cleanResult = result.replaceAll("^\"|\"$", "");
                Log.d(TAG, "Resultado da confirmação: " + cleanResult);
                
                if ("exit".equals(cleanResult)) {
                    Log.d(TAG, "Usuário confirmou saída - fechando app");
                    super.onBackPressed();
                } else {
                    Log.d(TAG, "Usuário cancelou saída - mantendo app aberto");
                }
            });
        } else {
            Log.d(TAG, "WebView não disponível - usando comportamento padrão");
            super.onBackPressed();
        }
    }
}
