import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onSave: (newValue: string) => Promise<void>
  className?: string
  textClassName?: string
  inputClassName?: string
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function EditableText({
  value,
  onSave,
  className = '',
  textClassName = '',
  inputClassName = '',
  isEditing,
  setIsEditing,
  onCancel,
  placeholder = '',
  autoFocus = true,
  disabled = false,
  children,
  onClick,
  size = 'md'
}: EditableTextProps) {
  const [editedValue, setEditedValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update editedValue when value changes
  useEffect(() => {
    setEditedValue(value)
  }, [value])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current && autoFocus) {
      inputRef.current.focus()
      // Select all text in the input
      inputRef.current.select()
    }
  }, [isEditing, autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value)
  }

  const handleBlur = async () => {
    setIsEditing(false)
    
    // Only submit if the value has changed and is not empty
    if (editedValue.trim() !== value && editedValue.trim() !== '') {
      try {
        await onSave(editedValue.trim())
      } catch (error) {
        console.error('Error saving value:', error)
        // Reset to original value on error
        setEditedValue(value)
      }
    } else {
      // Reset to original value if no change or empty
      setEditedValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditedValue(value)
      setIsEditing(false)
      if (onCancel) {
        onCancel()
      }
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      setIsEditing(true)
      if (onClick) {
        onClick(e)
      }
    }
  }

  // Size-based classes - increased sizes for all options
  const sizeClasses = {
    sm: 'text-sm', // Was text-sm
    md: 'text-lg',   // Was text-base
    lg: 'text-2xl'   // Was text-xl
  }

  return (
    <div className={cn("flex items-center", className)}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5",
            sizeClasses[size],
            inputClassName
          )}
          placeholder={placeholder}
          disabled={disabled}
          onClick={onClick}
        />
      ) : (
        <div 
          className={cn(
            "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded",
            disabled && "cursor-not-allowed opacity-50",
            sizeClasses[size],
            textClassName
          )}
          onClick={handleClick}
        >
          {children || value}
        </div>
      )}
    </div>
  )
} 