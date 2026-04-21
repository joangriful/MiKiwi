import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const INITIAL_FORM_DATA = {
    name: "",
    email: "",
    phone: "",
    orderId: "",
    reason: "defecto",
    message: "",
    terms: false,
};

export default function useClaimsForm() {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [submitted, setSubmitted] = useState(false);
    const referenceNumber = useMemo(
        () => (submitted ? `MK-${Date.now().toString().slice(-8)}` : null),
        [submitted],
    );

    const updateField = (name, value) => {
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        updateField(name, type === "checkbox" ? checked : value);
    };

    const toggleTerms = () => {
        setFormData((currentData) => ({
            ...currentData,
            terms: !currentData.terms,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.terms) {
            toast.warning("Debes aceptar la Politica de Privacidad para continuar.");
            return;
        }

        setSubmitted(true);
        toast.success("Reclamacion enviada. Nos pondremos en contacto contigo en un plazo maximo de 48 horas.");
    };

    return {
        formData,
        submitted,
        referenceNumber,
        handleChange,
        handleSubmit,
        toggleTerms,
    };
}
