import { NumberField } from "@/components/okr/NumberField";
import { personHandoff } from "@/lib/okr/formulas";
import { formatInt, formatNum } from "@/lib/okr/format";
import type { OkrModel, PersonInput, PersonRole } from "@/lib/okr/types";

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
  const rateMonth = model.baseline.month;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[960px] w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-3 py-3 font-medium">姓名</th>
            <th className="px-3 py-3 font-medium">角色</th>
            <th className="px-3 py-3 font-medium">7月线索</th>
            <th className="px-3 py-3 font-medium">8月线索</th>
            <th className="px-3 py-3 font-medium">群聊对接</th>
            <th className="px-3 py-3 font-medium">费率月对接</th>
            <th className="px-3 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id} className="border-t border-slate-100">
              <td className="px-3 py-3">
                <input
                  aria-label={`${person.name}姓名`}
                  className="w-28 rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  value={person.name}
                  onChange={(event) => onChange(person.id, { name: event.target.value })}
                />
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
                  value={person.julyLeads}
                  onChange={(julyLeads) => onChange(person.id, { julyLeads })}
                />
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}8月线索`}
                  value={person.augustLeads}
                  onChange={(augustLeads) => onChange(person.id, { augustLeads })}
                />
              </td>
              <td className="px-3 py-3">
                <NumberField
                  ariaLabel={`${person.name}群聊对接`}
                  value={person.groupChats}
                  onChange={(groupChats) => onChange(person.id, { groupChats })}
                />
              </td>
              <td className="px-3 py-3 font-mono font-medium">
                {formatInt(personHandoff(person, rateMonth))}
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
            <td className="px-3 py-3 text-xs text-slate-500">
              前端 {model.people.frontendCount} · 后端 {model.people.backendCount}
            </td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.julyLeads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.augustLeads)}</td>
            <td className="px-3 py-3 font-mono">{formatInt(model.people.totalGroup)}</td>
            <td className="px-3 py-3 font-mono">
              {formatInt(model.people.totalHandoff)}
              <p className="text-[11px] text-slate-500">
                {model.baseline.label}前端人均 {formatNum(model.people.avgHandoffFrontend, 1)}
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
