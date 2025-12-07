'use client'

import { Label } from '@/components/ui/label'
import type { Option } from '@/components/ui/multi-select'
import MultipleSelector from '@/components/ui/multi-select'
import { useGetCompanySkills } from '@/modules/skills/infrastructure/query/queries'
import React, { useEffect } from 'react'

const MultipleSelectWithPlaceholderDemo = ({
    handleChangeSkills,
    categories,
}: {
    handleChangeSkills: (names: string[]) => void
    categories: Option[]
}) => {
    useEffect(() => {
        console.log(categories)
    }, [categories])

    return (
        <div className="w-full max-w-xs space-y-2">
            {/* <Label>Выберите компетенции</Label> */}
            <MultipleSelector
                commandProps={{
                    label: 'Компетенции',
                }}
                // defaultOptions={categories}
                options={categories}
                placeholder="Компетенции"
                onChange={(e) =>
                    handleChangeSkills(e.map((item) => item.value))
                }
                emptyIndicator={<p className="text-center text-sm">Пусто</p>}
                className="w-full"
            />
            {/* <p className='text-muted-foreground text-xs' role='region' aria-live='polite'>
                Inspired by{' '}
                <a
                href='https://shadcnui-expansions.typeart.cc/docs/multiple-selector'
                className='hover:text-primary underline'
                target='_blank'
                >
                shadcn/ui expressions
                </a>
            </p> */}
        </div>
    )
}

export default MultipleSelectWithPlaceholderDemo
