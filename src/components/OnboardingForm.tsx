import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    negocio: '',
    administracionActual: '',
    otroMetodo: '',
    problemas: [] as string[],
    problemaDetalle: '',
    objetivo: ''
  });

  const [archivo, setArchivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => {
    setStep((prev) => (prev + 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("empresa", formData.empresa);
      data.append("email", formData.email);
      data.append("actividad", formData.negocio);
      
      const metodoFinal = formData.administracionActual === 'Otro' 
        ? `Otro: ${formData.otroMetodo}` 
        : formData.administracionActual;
      data.append("metodoAdmin", metodoFinal);

      const problemasTexto = `${formData.problemas.join(", ")} ${formData.problemaDetalle ? '| Detalle: ' + formData.problemaDetalle : ''}`;
      data.append("problema", problemasTexto);
      data.append("mejora", formData.objetivo);

      if (archivo) {
        data.append("files", archivo); 
      }

      const response = await fetch("https://backend-form-zbwy.vercel.app/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      setSuccess(true);
    } catch (err) {
      setError("Error al enviar. Verifica el tamaño del archivo o tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md italic">
          <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-stone-900">¡Diagnóstico Enviado!</h2>
          <p className="text-stone-600 mb-8">Gracias por tu tiempo, Gerónimo se pondrá en contacto pronto.</p>
          <button onClick={() => window.location.reload()} className="text-stone-400 font-bold uppercase tracking-widest text-xs">Volver al inicio</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans p-6 md:p-20">
      <div className="max-w-2xl mx-auto italic">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Diagnóstico Administrativo Inicial</h1>
          <p className="text-stone-500 mt-2">Paso {step} de 6</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                <input required type="text" placeholder="Tu nombre completo" className="w-full p-4 border rounded-xl" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                <input required type="text" placeholder="Nombre de tu empresa" className="w-full p-4 border rounded-xl" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} />
                <input required type="email" placeholder="Email de contacto" className="w-full p-4 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <textarea required className="w-full p-4 border rounded-xl h-40 resize-none" placeholder="¿A qué se dedica tu negocio?" value={formData.negocio} onChange={e => setFormData({...formData, negocio: e.target.value})} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-3">
                {ADMIN_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => setFormData({...formData, administracionActual: opt})} className={`w-full p-4 border rounded-xl text-left ${formData.administracionActual === opt ? 'bg-stone-900 text-white' : 'bg-white'}`}>{opt}</button>
                ))}
                {formData.administracionActual === 'Otro' && (
                  <input type="text" placeholder="Especificar método" className="w-full p-4 border rounded-xl mt-2" value={formData.otroMetodo} onChange={e => setFormData({...formData, otroMetodo: e.target.value})} />
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {PROBLEMAS_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => toggleProblema(opt)} className={`px-4 py-2 border rounded-full text-sm ${formData.problemas.includes(opt) ? 'bg-stone-900 text-white' : 'bg-white'}`}>{opt}</button>
                  ))}
                </div>
                <textarea className="w-full p-4 border rounded-xl h-32" placeholder="Más detalles..." value={formData.problemaDetalle} onChange={e => setFormData({...formData, problemaDetalle: e.target.value})} />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <textarea required className="w-full p-4 border rounded-xl h-40 resize-none" placeholder="¿Qué te gustaría mejorar?" value={formData.objetivo} onChange={e => setFormData({...formData, objetivo: e.target.value})} />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="s6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6 text-center">
                <p className="font-medium text-lg italic">¿Adjuntar un archivo?</p>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowFileUpload(true)} className={`flex-1 p-4 border rounded-xl ${showFileUpload === true ? 'bg-stone-100' : ''}`}>Sí</button>
                  <button type="button" onClick={() => {setShowFileUpload(false); setArchivo(null);}} className={`flex-1 p-4 border rounded-xl ${showFileUpload === false ? 'bg-stone-100' : ''}`}>No</button>
                </div>
                {showFileUpload && (
                  <div className="mt-6 p-10 border-2 border-dashed rounded-2xl bg-stone-50">
                    <input type="file" ref={fileInputRef} onChange={(e) => setArchivo(e.target.files?.[0] || null)} className="hidden" id="file-up" />
                    <label htmlFor="file-up" className="cursor-pointer flex flex-col items-center">
                      <Upload className="text-stone-400 mb-2" />
                      <span>{archivo ? archivo.name : "Seleccionar"}</span>
                    </label>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-10">
            {step > 1 && <button type="button" onClick={prevStep} className="text-stone-400">Anterior</button>}
            <button type={step === 6 ? "submit" : "button"} onClick={step === 6 ? undefined : nextStep} disabled={loading} className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold ml-auto disabled:bg-stone-400">
              {step === 6 ? (loading ? "Enviando..." : "Finalizar") : "Siguiente"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center font-medium mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}