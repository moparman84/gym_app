import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const exerciseLogSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.string().optional(),
  reps: z.string().optional(),
  weight: z.string().optional(),
  notes: z.string().optional()
});

const logSchema = z.object({
  workoutName: z.string().min(1, 'Workout name is required'),
  date: z.string().min(1, 'Date is required'),
  exercises: z.array(exerciseLogSchema).min(1, 'At least one exercise is required'),
  notes: z.string().optional()
});

const LogModal = ({ onSave, onClose }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(logSchema),
    defaultValues: {
      workoutName: '',
      date: new Date().toISOString().split('T')[0],
      exercises: [{ name: '', sets: '', reps: '', weight: '', notes: '' }],
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises'
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Workout Log</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700">
                      Workout Name *
                    </label>
                    <input
                      type="text"
                      id="workoutName"
                      {...register('workoutName')}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Leg Day"
                    />
                    {errors.workoutName && (
                      <p className="mt-1 text-sm text-red-600">{errors.workoutName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      {...register('date')}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Exercises *
                    </label>
                    <button
                      type="button"
                      onClick={() => append({ name: '', sets: '', reps: '', weight: '', notes: '' })}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Exercise
                    </button>
                  </div>

                  {errors.exercises?.root && (
                    <p className="mb-2 text-sm text-red-600">{errors.exercises.root.message}</p>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Exercise {index + 1}
                          </span>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              {...register(`exercises.${index}.name`)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              placeholder="Exercise name"
                            />
                            {errors.exercises?.[index]?.name && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors.exercises[index].name.message}
                              </p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              {...register(`exercises.${index}.sets`)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              placeholder="Sets"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              {...register(`exercises.${index}.reps`)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              placeholder="Reps"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              {...register(`exercises.${index}.weight`)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              placeholder="Weight"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              {...register(`exercises.${index}.notes`)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              placeholder="Notes"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Overall Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    {...register('notes')}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="How did the workout go?"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Log
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogModal;
