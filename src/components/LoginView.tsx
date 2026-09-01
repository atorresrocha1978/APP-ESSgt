import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Stethoscope, 
  Syringe, 
  Smile, 
  UserPlus, 
  Tv, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ROOMS } from '../constants/rooms';

export const LoginView: React.FC = () => {
  const { login, quickLoginAsUser, users, enterTvModeDirectly } = useClinic();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Por favor, informe o nome de usuário.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Por favor, digite a sua senha de acesso.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Erro ao realizar login. Verifique os dados digitados.');
      }
    }, 250);
  };

  const handleFillCredentials = (userLogin: string, pass: string = '123') => {
    setUsername(userLogin);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100/50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      
      {/* Container Card */}
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-200 ring-4 ring-white">
            <Activity className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              ESSgt <span className="text-red-600 font-black">- UIS</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-600 mt-1 max-w-lg mx-auto">
              Escola Superior de Sargentos • <span className="text-red-600 font-bold">Unidade Integrada de Saúde</span>
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Gestão de Chamada de Senhas, Atendimento e Fila de Consultórios
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Form & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Form */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 rounded-3xl border border-sky-100 shadow-xl shadow-blue-100/60 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Autenticação de Profissional</span>
              </div>
              <h2 className="text-xl font-black text-slate-800">
                Acesse o seu Posto de Trabalho
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Digite seu usuário e senha para chamar pacientes e registrar atendimentos.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-3 animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-black">Falha no Acesso</p>
                  <p className="font-normal text-rose-600 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Usuário ou Matrícula
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: dr.roberto, enf.camila, admin"
                    className="w-full pl-10 pr-4 py-3 bg-sky-50/50 border border-sky-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Senha de Acesso
                  </label>
                  <span className="text-[11px] font-semibold text-blue-600">
                    Senha padrão demo: <strong className="font-mono">123</strong>
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    className="w-full pl-10 pr-11 py-3 bg-sky-50/50 border border-sky-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Posto de Atendimento</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Direct TV Mode Action */}
            <div className="pt-5 border-t border-sky-100 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-400">
                Vai projetar na TV da Sala de Espera?
              </p>
              <button
                id="btn-direct-tv-mode"
                onClick={enterTvModeDirectly}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tv className="w-4 h-4 text-emerald-400" />
                <span>Abrir Painel da TV em Modo Público</span>
              </button>
            </div>
          </div>

          {/* Right Column: Quick Station Access Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acesso Rápido por Consultório & Posto:</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Clique para entrar direto</span>
              </div>

              <div className="space-y-2.5">
                
                {/* Consultório 01 */}
                <button
                  onClick={() => quickLoginAsUser('usr-dr-roberto')}
                  className="w-full p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-600 hover:text-white border border-blue-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 group-hover:bg-white text-white group-hover:text-blue-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Consultório 01 (Clínico Geral)
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-200 group-hover:bg-blue-500 text-blue-900 group-hover:text-white font-bold">
                          CLI
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-blue-100">
                        Dr. Roberto Silveira • CRM 142.890/SP
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Consultório 02 */}
                <button
                  onClick={() => quickLoginAsUser('usr-dra-mariana')}
                  className="w-full p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-600 hover:text-white border border-purple-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 group-hover:bg-white text-white group-hover:text-purple-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Consultório 02 (Especialidades)
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-200 group-hover:bg-purple-500 text-purple-900 group-hover:text-white font-bold">
                          ESP
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-purple-100">
                        Dra. Mariana Vasconcelos • CRM 189.442/SP (Cardio)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Sala de Medicação */}
                <button
                  onClick={() => quickLoginAsUser('usr-enf-camila')}
                  className="w-full p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-600 hover:text-white border border-amber-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 group-hover:bg-white text-white group-hover:text-amber-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <Syringe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Sala de Medicação & Enfermagem
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-200 group-hover:bg-amber-500 text-amber-900 group-hover:text-white font-bold">
                          MED
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-amber-100">
                        Enfª. Camila Duarte • COREN 321.654/SP
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Odontológico 01 */}
                <button
                  onClick={() => quickLoginAsUser('usr-dr-lucas')}
                  className="w-full p-3 rounded-2xl bg-teal-50/70 hover:bg-teal-600 hover:text-white border border-teal-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 group-hover:bg-white text-white group-hover:text-teal-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Odontológico 01 (Dentista)
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-200 group-hover:bg-teal-500 text-teal-900 group-hover:text-white font-bold">
                          OD1
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-teal-100">
                        Dr. Lucas Ferreira • CRO 45.123/SP
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Recepção */}
                <button
                  onClick={() => quickLoginAsUser('usr-recepcao')}
                  className="w-full p-3 rounded-2xl bg-sky-50/70 hover:bg-sky-600 hover:text-white border border-sky-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500 group-hover:bg-white text-white group-hover:text-blue-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Recepção & Triagem de Pacientes
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 group-hover:bg-blue-400 text-blue-800 group-hover:text-white">
                          SENHAS
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-sky-100">
                        Ana Paula Rocha • Emissão e Encaminhamento
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {/* Painel Administrativo */}
                <button
                  onClick={() => quickLoginAsUser('usr-admin')}
                  className="w-full p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-600 hover:text-white border border-indigo-200/80 transition-all text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-white text-white group-hover:text-indigo-600 flex items-center justify-center font-black text-xs shadow-xs transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs group-hover:text-white text-slate-800">
                          Painel Administrativo & Gestão
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 group-hover:bg-indigo-400 text-indigo-800 group-hover:text-white">
                          ADMIN
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 group-hover:text-indigo-100">
                        Cadastrar Usuários, Relatórios e Métricas
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

              </div>
            </div>

            {/* Quick credentials hint */}
            <div className="bg-sky-100/70 p-3.5 rounded-2xl border border-sky-200 text-center flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Você pode cadastrar e gerenciar novos médicos, dentistas e enfermeiros no Painel Administrativo.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
