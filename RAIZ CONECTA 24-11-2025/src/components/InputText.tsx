import InputTextClass from '@/styles/InputText.module.css';
import { ChangeEvent, FocusEvent } from 'react';
import { Form } from 'react-bootstrap';

interface InputTextProps {
    label: string;
    inputName: string;
    placeholder?: string;
    value?: string;
    id?: string;
    onChange?: (e: ChangeEvent<any>) => void;
    // ESTAS DUAS LINHAS SÃO ESSENCIAIS PARA O FORMIK:
    onBlur?: (e: FocusEvent<any>) => void;
    touched?: boolean;
    error?: string | undefined;
    type?: string;
}

export function InputText(props: InputTextProps) {
    const {
        label, inputName, placeholder,
        value, id, onChange, onBlur, error, touched,
        type = "text"
    } = props;

    // Só mostra erro se tiver mensagem de erro E o campo foi "tocado" (usuário clicou e saiu)
    const isInvalid = !!error && (touched !== undefined ? touched : true);

    return (
        <div className="mb-3 w-full">
            <Form.Label htmlFor={id} className={`${InputTextClass.label} font-medium text-gray-700 text-sm`}>
                {label}
            </Form.Label>
            <Form.Control
                id={id}
                type={type}
                name={inputName}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur} // Passando o evento para o Formik saber que saiu do campo
                isInvalid={isInvalid}
                className="shadow-sm border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Form.Control.Feedback type="invalid" className="text-xs text-red-600 font-medium">
                {error}
            </Form.Control.Feedback>
        </div>
    );
}