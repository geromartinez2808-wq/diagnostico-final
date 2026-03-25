import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X,
  Building2,
  User,
  Mail,
  Briefcase,
  Target,
  FileUp
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  negocio: string;
  administracionActual: string;
  otroMetodo: string;
  problemas: string[];
  problemaDetalle: string; // Consolidado aquí
  objetivo: string;
}

const PROBLEMAS_OPTIONS = [
  "Desorden financiero",
  "Falta de control de ingresos y gastos",
  "Demasiadas tareas administrativas",
  "Facturación desorganizada",
  "Falta de reportes claros"
];

const ADMIN_OPTIONS = [
  "Excel / Google Sheets",
  "Sistema de gestión",
  "Contador o estudio contable",
  "Yo mismo",
  "Otro"
];

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFileUpload, setShowFileUpload] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    empresa: '',
    email: '',
    negocio: '',
    administracionActual: '',
    otroMetodo: '',
    problemas: [],
    problemaDetalle: '',
    objetivo: ''
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateStep = (currentStep: Step): boolean => {
    // Mantengo la validación relajada para tus pruebas
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev + 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProblema = (option: string) => {
    setFormData(prev => ({
      ...prev,
      problemas: prev.problemas.includes(option)
        ? prev.problemas.filter(p => p !== option)
        : [...prev.problemas, option]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setArchivo(file);
  };

  const removeFile = () => {
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const progress = (step / 6) * 100;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step !== 6) return;

    setLoading(true);
    setError(null);

    const problemasSeleccionados = formData.problemas.join(", ");
    const detalleExtra = formData.problemaDetalle ? `\nDetalle: ${formData.problemaDetalle}` : "";
    
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("empresa", formData.empresa);
    data.append("email", formData.email);
    data.append("actividad", formData.negocio);
    data.append("metodoAdmin", `${formData.administracionActual}${formData.otroMetodo ? ': ' + formData.otroMetodo : ''}`);
    data.append("problema", `${problemasSeleccionados}${detalleExtra}`);
    data.append("mejora", formData.objetivo);

    if (archivo) data.append("files", archivo);

    try {
      const res = await fetch("https://backend-form-zbwy.vercel.app/upload", {
        method: "POST",
        body: data
      });

      if (!res.ok) throw new Error("Error en el envío. Intenta de nuevo.");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mb-4">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-stone-900 leading-tight">Gracias por completar el diagnóstico</h2>
            <p className="text-stone-500 text-lg">Revisaremos tu información en las próximas 24 horas.</p>
          </div>
          <div className="pt-8 border-t border-stone-100">
            <p className="text-stone-400 font-serif italic text-lg">— Gerónimo adm</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 text-stone-400 hover:text-stone-900 transition-colors text-xs font-bold tracking-widest uppercase">
            Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-stone-200">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-stone-100 z-50">
        <motion.div className="h-full bg-stone-900" animate={{ width: `${progress}%` }} />
      </div>

      <main className="max-w-2xl mx-auto px-6 py-20 md:py-32">
        <header className="mb-16 space-y-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3 block">Gerónimo adm</span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Diagnóstico administrativo</h1>
          </motion.div>
        </header>

        <form 
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (step < 6) nextStep();
            }
          }}
          className="space-y-12"
        >
          <AnimatePresence mode="wait">
            {/* Paso 1: Básicos */}
            {step === 1 && (
              <motion.section key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><User size={20} className="text-stone-400" /> Información básica</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Nombre completo" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                  <input type="text" placeholder="Empresa" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                  <input type="email" placeholder="Email de contacto" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                </div>
              </motion.section>
            )}

            {/* Paso 2: Negocio */}
            {step === 2 && (
              <motion.section key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><Briefcase size={20} className="text-stone-400" /> Tu Negocio</h3>
                <textarea rows={4} placeholder="¿A qué se dedica tu negocio?" value={formData.negocio} onChange={e => setFormData({...formData, negocio: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {/* Paso 3: Administración */}
            {step === 3 && (
              <motion.section key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className="text-xl font-medium">Administración actual</h3>
                <div className="grid gap-3">
                  {ADMIN_OPTIONS.map(opt => (
                    <label key={opt} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.administracionActual === opt ? 'border-stone-900 bg-stone-50' : 'bg-white'}`}>
                      <input type="radio" className="hidden" checked={formData.administracionActual === opt} onChange={() => setFormData({...formData, administracionActual: opt})} />
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${formData.administracionActual === opt ? 'border-stone-900' : 'border-stone-300'}`}>
                        {formData.administracionActual === opt && <div className="w-2 h-2 rounded-full bg-stone-900" />}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
                {formData.administracionActual === 'Otro' && (
                   <textarea rows={3} placeholder="Detalla tu método..." value={formData.otroMetodo} onChange={e => setFormData({...formData, otroMetodo: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all" />
                )}
              </motion.section>
            )}

            {/* Paso 4: Desafíos */}
            {step === 4 && (
              <motion.section key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className="text-xl font-medium">Desafíos principales</h3>
                <div className="flex flex-wrap gap-2">
                  {PROBLEMAS_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => toggleProblema(opt)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.problemas.includes(opt) ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border-stone-200'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea rows={4} placeholder="Cuéntanos un poco más..." value={formData.problemaDetalle} onChange={e => setFormData({...formData, problemaDetalle: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {/* Paso 5: Objetivo */}
            {step === 5 && (
              <motion.section key="s5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2"><Target size={20} className="text-stone-400" /> Objetivo</h3>
                <textarea rows={4} placeholder="¿Qué te gustaría mejorar primero?" value={formData.objetivo} onChange={e => setFormData({...formData, objetivo: e.target.value})} className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 outline-none focus:border-stone-900 transition-all resize-none" />
              </motion.section>
            )}

            {/* Paso 6: Archivo */}
            {step === 6 && (
              <motion.section key="s6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium flex items-start gap-2"><FileUp size={20} className="text-stone-400 mt-1" /> ¿Quieres adjuntar un archivo?</h3>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowFileUpload(true)} className={`flex-1 py-3 rounded-xl border font-medium ${showFileUpload === true ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white'}`}>Sí</button>
                    <button type="button" onClick={() => { setShowFileUpload(false); removeFile(); }} className={`flex-1 py-3 rounded-xl border font-medium ${showFileUpload === false ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white'}`}>No</button>
                  </div>
                </div>

                {showFileUpload && (
                  <div className="space-y-4">
                    <label htmlFor="file-up" className="block border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center hover:bg-stone-50 cursor-pointer">
                      <input id="file-up" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                      <Upload size={24} className="mx-auto text-stone-300 mb-2" />
                      <p className="text-sm font-medium">Click para seleccionar</p>
                    </label>
                    {archivo && (
                      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-2"><FileText size={18} /> <span className="text-sm truncate max-w-[150px]">{archivo.name}</span></div>
                        <button type="button" onClick={removeFile} className="text-stone-300 hover:text-red-500"><X size={18} /></button>
                      </div>
                    )}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Navegación */}
          <div className="pt-8 border-t border-stone-100 flex flex-col gap-6">
            {error && <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-sm"><AlertCircle size={18} /> {error}</div>}
            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button type="button" onClick={prevStep} disabled={loading} className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors">
                  <ChevronLeft size={20} /> Anterior
                </button>
              ) : <div />}
              
              {step < 6 ? (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium shadow-xl hover:bg-stone-800 transition-all active:scale-95">
                  Siguiente <ChevronRight size={20} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-stone-900 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:bg-stone-800 transition-all disabled:bg-stone-400">
                  {loading ? 'Enviando...' : 'Enviar diagnóstico'} <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}