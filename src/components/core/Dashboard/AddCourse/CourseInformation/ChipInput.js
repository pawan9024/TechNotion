import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  // On component mount
  useEffect(() => {
    // If editing course, prefill tags
    if (editCourse && course?.tag) {
      setChips(course.tag)
    }

    // Register field with validation
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update form value whenever chips change
  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  // Handle adding chip on Enter or ,
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const inputValue = e.target.value.trim()

      if (inputValue && !chips.includes(inputValue)) {
        setChips((prev) => [...prev, inputValue])
        e.target.value = ""
      }
    }
  }

  // Delete a chip by index
  const handleDeleteChip = (indexToDelete) => {
    setChips((prev) => prev.filter((_, index) => index !== indexToDelete))
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-900"
          >
            {chip}
            <button
              type="button"
              onClick={() => handleDeleteChip(index)}
              className="ml-2"
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full min-w-[120px] flex-1"
        />
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200 bg-caribbeangreen-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
