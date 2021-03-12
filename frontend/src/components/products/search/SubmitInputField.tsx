import { FC, FormEvent, ChangeEvent } from 'react';

interface SubmitInputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  buttonValue: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  onSubmit(e: FormEvent<HTMLFormElement>): void;
}

// Input field for searching
const SubmitInputField: FC<SubmitInputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  buttonValue,
  onChange,
  onSubmit,
}) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></input>
        <input type="submit" value={buttonValue}></input>
      </form>
    </div>
  );
};

export default SubmitInputField;
