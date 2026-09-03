import { NumberField } from "@/components/okr/NumberField";
import { personConversion } from "@/lib/okr/formulas";
import { formatInt, formatNum, formatPct } from "@/lib/okr/format";
import { personDealsIn, personLeadsIn } from "@/lib/okr/mock-data";
import type { OkrModel, PersonEmployment, PersonInput, PersonRole } from "@/lib/okr/types";

function conversionLabel(leads: number, deals: number): string {
  if (!leads) return "—";
  return formatPct(personConversion(leads, deals));
}

export function PeoplePanel({
  people,
  model,
  onChange,
  onRemove,
  onAdd,
}: {
  people: PersonInput[];
  model: OkrModel;
  onChange: (id: string, patch: Partial<PersonInput>) => void;
  onRemove: (id: string) => void;
  onAdd: (role: PersonRole) => void;
}) {
  const visible = people;
  const rateMonth = model.baseline.month;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[1100px] w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-3 py-3 font-medium">姓名</th>
            <th className="px-3 py-3 font-medium">状态</th>
            <th className="px-3 py-3 font-medium">角色</th>
            <th className="px-3 py-3 font-medium">7月线索</th>
            <th className="px-3 py-3 font-medium">7月成交</th>
            <th className="px-3 py-3 font-medium">7月转化</th>
            <th className="px-3 py-3 font-medium">8月线索</th>
            <th className="px-3 py-3 font-medium">8月成交</th>
            <th className="px-3 py-3 font-medium">8月转化</th>
            <th className="px-3 py-3 font-medium">{model.baseline.label}转化</th>
            <th className="px-3 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {visible.map((person) => (
            <tr key={person.id} className="border-t border-slate-100">
              <td className="px-3 py-3">
                <input
                  aria-label={`${person.name}姓名`}
                  className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  value={person.name}
                  onChange={(event) => onChange(person.id, { name: event.target.value })}
                />
              </td>
              <td className="px-3 py-3">
                <select
                  aria-label={`${person.name}在职状态`}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-teal-600"
                  value={person.employment}
                  onChange={(event) =>
                    onChange(person.id, { employment: event.target.value as PersonEmployment })
                  }
                >
                  <option value="active">在职</option>
                  <option value="departed">离职</option>
                </select>
              </td>
              <td className="px-3 py-3">
                <select
                  aria-label={`${person.name}角色`}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-teal-600"
                  value={person.role}
                  onChange={(event) =>
                    onChange(person.id, { role: event.target.value as PersonRole })
                  }
                >
                  <option value="frontend">前端（销售）</option>
                  <option value="backend">后端（交付）</option>
                </select>
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}7月线索`}
                  className="[&_input]:w-16"
                  value={person.julyLeads}
                  onChange={(julyLeads) => onChange(person.id, { julyLeads })}
                />
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}7月成交`}
                  className="[&_input]:w-16"
                  value={person.julyDeals}
                  onChange={(julyDeals) => onChange(person.id, { julyDeals })}
                />
              </td>
              <td className="px-3 py-3 font-mono text-slate-700">
                {conversionLabel(person.julyLeads, person.julyDeals)}
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}8月线索`}
                  className="[&_input]:w-16"
                  value={person.augustLeads}
                  onChange={(augustLeads) => onChange(person.id, { augustLeads })}
                />
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}8月成交`}
                  className="[&_input]:w-16"
                  value={person.augustDeals}
                  onChange={(augustDeals) => onChange(person.id, { augustDeals })}
                />
              </td>
              <td className="px-3 py-3 font-mono text-slate-700">
                {conversionLabel(person.augustLeads, person.augustDeals)}
              </td>
              <td className="px-3 py-3 font-mono font-medium">
                {conversionLabel(personLeadsIn(person, rateMonth), personDealsIn(person, rateMonth))}
              </td>
              <td className="px-3 py-3">
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-rose-600"
                  onClick={() => onRemove(person.id)}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-200 bg-slate-50">
          <tr>
            <td className="px-3 py-3 font-medium">合计 / 人均</td>
            <td className="px-3 py-3 text-xs text-slate-500" colSpan={2}>
              在职 {model.people.frontendActiveCount} · 离职 {model.people.frontendDepartedCount}
              计 {formatNum(model.people.frontendDepartedCount / 2, 1)} 编 · 前端{" "}
              {formatNum(model.people.frontendFte, 1)} 人 · 后端 {model.people.backendCount}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.julyLeads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.julyDeals)}</td>
            <td className="px-3 py-3 font-mono">
              {conversionLabel(model.people.julyLeads, model.people.julyDeals)}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.augustLeads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.augustDeals)}</td>
            <td className="px-3 py-3 font-mono">
              {conversionLabel(model.people.augustLeads, model.people.augustDeals)}
            </td>
            <td className="px-3 py-3 font-mono">
              {formatPct(model.people.conversionRate)}
              <p className="text-[11px] font-normal text-slate-500">
                {model.baseline.label}人均线索 {formatNum(model.people.avgLeadsPerFrontend, 1)}
              </p>
            </td>
            <td className="px-3 py-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-white"
                  onClick={() => onAdd("frontend")}
                >
                  加前端
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-white"
                  onClick={() => onAdd("backend")}
                >
                  加后端
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
