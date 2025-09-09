import { useState } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { 
  User, 
  Edit3, 
  Bell, 
  Shield, 
  Moon, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CreditCard,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  const { usuario, logout, isDarkMode, toggleDarkMode, showNotification } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    usuario?.preferencias?.notificacoes ?? true
  );
  const [biometriaEnabled, setBiometriaEnabled] = useState(
    usuario?.preferencias?.biometria ?? false
  );

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20">
        <AppHeader title="Perfil" />
        <div className="max-w-md mx-auto p-4">
          <Card className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">Faça login</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Entre em sua conta para acessar seu perfil
            </p>
            <Button onClick={() => navigate('/login')}>
              Fazer login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    showNotification('Logout realizado com sucesso', 'success');
    navigate('/login');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader 
        title="Perfil" 
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/perfil/editar')}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        }
      />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={usuario.avatarUrl} alt={usuario.nome} />
              <AvatarFallback className="text-lg">
                {usuario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-card-foreground">
                {usuario.nome}
              </h2>
              <p className="text-sm text-muted-foreground">
                {calculateAge(usuario.dataNascimento)} anos
              </p>
              {usuario.cns && (
                <p className="text-sm text-muted-foreground">
                  CNS: {usuario.cns}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Informações Pessoais */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            Informações Pessoais
          </h3>
          
          <Card className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CPF</p>
                <p className="text-sm text-muted-foreground">
                  {formatCPF(usuario.cpf)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">CNS</p>
                <p className="text-sm text-muted-foreground">
                  {usuario.cns || "Não informado"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data de Nascimento</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">E-mail</p>
                <p className="text-sm text-muted-foreground">
                  {usuario.email}
                </p>
              </div>
            </div>
            
            {usuario.telefone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPhone(usuario.telefone)}
                  </p>
                </div>
              </div>
            )}
            
            {usuario.endereco && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {usuario.endereco}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Configurações */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            Configurações
          </h3>
          
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Notificações</p>
                  <p className="text-xs text-muted-foreground">
                    Receber alertas sobre consultas
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Login com Biometria</p>
                  <p className="text-xs text-muted-foreground">
                    Usar impressão digital
                  </p>
                </div>
              </div>
              <Switch
                checked={biometriaEnabled}
                onCheckedChange={setBiometriaEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Modo Escuro</p>
                  <p className="text-xs text-muted-foreground">
                    Tema escuro do aplicativo
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </Card>
        </section>

        {/* Ações */}
        <section>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/perfil/editar')}
            >
              <Edit3 className="h-4 w-4 mr-3" />
              Editar Perfil
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/perfil/configuracoes')}
            >
              <Settings className="h-4 w-4 mr-3" />
              Configurações Avançadas
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair da Conta
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}