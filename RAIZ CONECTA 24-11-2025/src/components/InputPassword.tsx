import { useState, ChangeEvent, FocusEvent } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import InputTextClass from '@/styles/InputText.module.css';

interface InputPasswordProps {
  label: string;
  inputName: string;
  placeholder?: string;
  value?: string;
  id?: string;
  onChange?: (e: ChangeEvent<any>) => void;
  // CORREÇÃO AQUI: Adicionando onBlur e touched na interface
  onBlur?: (e: FocusEvent<any>) => void;
  touched?: boolean;
  error?: string | undefined;
}

export function InputPassword(props: InputPasswordProps) {
  const {
    label, inputName, placeholder, value, id,
    onChange, onBlur, error, touched
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isInvalid = !!error && (touched !== undefined ? touched : true);

  return (
    <div className="mb-3 w-full">
      <Form.Label htmlFor={id} className={`${InputTextClass.label} font-medium text-gray-700 text-sm`}>
        {label}
      </Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          id={id}
          type={showPassword ? "text" : "password"}
          name={inputName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Conectando o onBlur
          isInvalid={isInvalid}
          className="shadow-sm border-r-0 border-gray-300 focus:border-green-500 focus:ring-green-500"
        />
        <InputGroup.Text
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer bg-white border-l-0 border-gray-300 text-gray-500 hover:text-green-600 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </InputGroup.Text>
        <Form.Control.Feedback type="invalid" className="text-xs text-red-600 font-medium">
          {error}
        </Form.Control.Feedback>
      </InputGroup>
    </div>
  );
}