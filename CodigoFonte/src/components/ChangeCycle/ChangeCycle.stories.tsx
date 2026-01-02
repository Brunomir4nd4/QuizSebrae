import type { Meta, StoryObj } from '@storybook/nextjs';
import { ChangeCycle } from './ChangeCycle.component';
import { Divider, Grid } from '@mui/material';
import { Dropdown } from '../Dropdown';
import { CardCycle } from './components';
import { ButtonClass } from '../ButtonClass';

const meta: Meta<typeof ChangeCycle> = {
  title: 'components/Molecules/ChangeCycle/TrocarTurma',
  component: ChangeCycle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

type Story = StoryObj<typeof meta>;

// Mock Data
const role = 'supervisor';
const selectedYear = '2024';
const getLastYears = () => ['2024', '2023', '2022'];

const filteredCycles = [
  { id: 1, name: '01' },
  { id: 2, name: '02' },
  { id: 3, name: '03' },
  { id: 4, name: '04' },
];

const classes = {
  diurno: [
    { id: 1, name: 'Turma A' },
    { id: 2, name: 'Turma B' },
  ],
};

const changeClass = (id: string) => {
  console.log('Turma selecionada:', id);
};

// --- STORY 1: Somente Ciclos
export const Ciclo: Story = {
  render: () => (
    <Grid container spacing={3} sx={{ minWidth: '100%' }}>
      <Grid item xs={12}>
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mb-[30px] md:mb-[0px] flex justify-between items-center">
          <span className="flex">
            <strong className="font-bold">Selecione </strong>&nbsp;
            <span>o ciclo</span>
          </span>
          {role === 'supervisor' && (
            <Dropdown
              startItem={selectedYear}
              years={getLastYears()}
              onClick={() => console.log('Ano selecionado')}
            />
          )}
        </h2>
        <div className="min-w-[100%] rounded-[20px] bg-[#E0E3E8] border border-[#D0D1D4] p-[25px] mt-[17px] flex gap-3 md:gap-3 flex-wrap">
          {filteredCycles.length > 0 ? (
            filteredCycles.map((item) => (
              <div
                key={`cycle_${item.id}`}
                className="w-[22%] min-w-[22%] md:min-w-[11%] xl:min-w-[7%]"
              >
                <CardCycle
                  title="Ciclo"
                  numberDay={item.name}
                  active={false}
                  id={item.id.toString()}
                  setConsultancyDate={() => console.log('Ciclo selecionado')}
                />
              </div>
            ))
          ) : (
            <p className="text-2xl 3xl:text-32 text-black-light font-light">
              Não há ciclos disponíveis.
            </p>
          )}
        </div>
      </Grid>
    </Grid>
  ),
};

// --- STORY 2: Somente Turmas
export const Turma: Story = {
  render: () => (
    <Grid container spacing={3} sx={{ minWidth: '100%' }}>
      <Grid item xs={12}>
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mb-[30px] md:mb-[0px]">
          <strong className="font-bold">Selecione </strong>uma turma
        </h2>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden">
              <div className="py-[20px] px-[20px] md:px-[40px] flex justify-between">
                <h3 className="text-2xl 3xl:text-32 text-black-light font-bold">
                  Manhã
                </h3>
                <p className="text-2xl 3xl:text-32 text-black-light font-light">
                  10h
                </p>
              </div>
              <Divider />
              {classes.diurno.map((classItem) => (
                <div
                  key={classItem.id}
                  onClick={() => changeClass(`${classItem.id}`)}
                >
                  <ButtonClass
                    classId={classItem.id.toString()}
                    text={classItem.name}
                  />
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ),
};

// --- STORY 3: Ciclo + Turma (Completo)
export const Completo: Story = {
  render: () => (
    <Grid container spacing={3} sx={{ minWidth: '100%' }}>
      {/* Parte de Ciclos */}
      <Grid item xs={12}>
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mb-[30px] md:mb-[0px] flex justify-between items-center">
          <span className="flex">
            <strong className="font-bold">Selecione </strong>&nbsp;
            <span>o ciclo</span>
          </span>
          {role === 'supervisor' && (
            <Dropdown
              startItem={selectedYear}
              years={getLastYears()}
              onClick={() => console.log('Ano selecionado')}
            />
          )}
        </h2>
        <div className="min-w-[100%] rounded-[20px] bg-[#E0E3E8] border border-[#D0D1D4] p-[25px] mt-[17px] flex gap-3 md:gap-3 flex-wrap">
          {filteredCycles.length > 0 ? (
            filteredCycles.map((item) => (
              <div
                key={`cycle_${item.id}`}
                className="w-[22%] min-w-[22%] md:min-w-[11%] xl:min-w-[7%]"
              >
                <CardCycle
                  title="Ciclo"
                  numberDay={item.name}
                  active={false}
                  id={item.id.toString()}
                  setConsultancyDate={() => console.log('Ciclo selecionado')}
                />
              </div>
            ))
          ) : (
            <p className="text-2xl 3xl:text-32 text-black-light font-light">
              Não há ciclos disponíveis.
            </p>
          )}
        </div>
      </Grid>

      {/* Parte de Turmas */}
      <Grid item xs={12}>
        <h2 className="text-2xl md:text-3xl 3xl:text-4xl text-[#070D26] font-extralight mt-[30px] md:mt-[60px] mb-[10px] md:mb-[0px]">
          <strong className="font-bold">Selecione </strong>uma turma
        </h2>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="rounded-[20px] w-[100%] bg-[#E0E3E8] border border-[#D0D1D4] mt-[17px] overflow-hidden">
              <div className="py-[20px] px-[20px] md:px-[40px] flex justify-between">
                <h3 className="text-2xl 3xl:text-32 text-black-light font-bold">
                  Manhã
                </h3>
                <p className="text-2xl 3xl:text-32 text-black-light font-light">
                  10h
                </p>
              </div>
              <Divider />
              {classes.diurno.map((classItem) => (
                <div
                  key={classItem.id}
                  onClick={() => changeClass(`${classItem.id}`)}
                >
                  <ButtonClass
                    classId={classItem.id.toString()}
                    text={classItem.name}
                  />
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ),
};

export default meta;
