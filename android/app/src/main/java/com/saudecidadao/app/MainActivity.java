package com.saudecidadao.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

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
        // Deixa o Capacitor gerenciar a navegação
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            if (webView.canGoBack()) {
                webView.goBack();
            } else {
                super.onBackPressed();
            }
        } else {
            super.onBackPressed();
        }
    }
}