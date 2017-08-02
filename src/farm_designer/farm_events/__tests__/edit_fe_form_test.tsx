import * as React from "react";
import { fakeFarmEvent, fakeSequence } from "../../../__test_support__/fake_state/resources";
import { mount } from "enzyme";
import { EditFEForm, EditFEProps, FarmEventViewModel, recombine } from "../edit_fe_form";
import { isString } from "lodash";

describe("<FarmEventForm/>", () => {
  let props = (): EditFEForm["props"] => ({
    deviceTimezone: undefined,
    executableOptions: [],
    repeatOptions: [],
    farmEvent: fakeFarmEvent("Sequence", 12),
    dispatch: jest.fn(),
    findExecutable: jest.fn(() => fakeSequence()),
    title: "title"
  });

  function instance(p: EditFEProps) {
    return mount<EditFEProps>(<EditFEForm {...p } />).instance() as EditFEForm;
  }
  let context = { form: new EditFEForm(props()) };

  beforeEach(() => {
    context.form = new EditFEForm(props());
  });

  it("sets defaults", () => {
    expect(context.form.state.fe).toMatchObject({});
    expect(context.form.state.localCopyDirty).toBeFalsy();
  });

  it("determines if it is a one time event", () => {
    let i = instance(props());
    expect(i.isOneTime).toBe(true);
    i.mergeState("timeUnit", "daily");
    i.forceUpdate();
    expect(i.isOneTime).toBe(false);
  });

  it("has a dispatch", () => {
    let p = props();
    let i = instance(p);
    expect(i.dispatch).toBe(p.dispatch);
    i.dispatch();
    expect((p.dispatch as jest.Mock<{}>).mock.calls.length).toBe(1);
  });

  it("has a view model", () => {
    let p = props();
    let i = instance(p);
    i.forceUpdate();
    let vm = i.viewModel;
    let KEYS: (keyof FarmEventViewModel)[] = [
      "startDate",
      "startTime",
      "endDate",
      "endTime",
      "repeat",
      "timeUnit",
      "executable_type",
      "executable_id",
    ];

    KEYS.map(key => expect(isString(vm[key])).toBe(true));
    expect(vm.repeat).toEqual("" + p.farmEvent.body.repeat);
  });

  it("has an executable", () => {
    let p = props();
    let i = instance(p);
    i.forceUpdate();
    expect(i.executableGet().value).toEqual(fakeSequence().body.id);
    expect(i.executableGet().label).toEqual(fakeSequence().body.name);
  });

  it("sets the executable", () => {
    let p = props();
    let i = instance(p);
    i.forceUpdate();
    expect(i.state.localCopyDirty).toBe(false);
    let e = { value: "wow", executable_type: "Sequence" } as any;
    i.executableSet(e);
    i.forceUpdate();
    expect(i.state.localCopyDirty).toBe(true);
    expect(i.state.fe.executable_type).toEqual("Sequence");
    expect(i.state.fe.executable_id).toEqual("wow");
  });

  it("gets executable info", () => {
    let p = props();
    let i = instance(p);
    i.forceUpdate();
    let exe = i.executableGet();
    expect(exe.label).toBe("fake");
    expect(exe.value).toBe(12);
    expect(exe.executable_type).toBe("Sequence");
  });

  it("sets a subfield of state.fe", () => {
    let p = props();
    let i = instance(p);
    i.forceUpdate();
    expect(i.state.localCopyDirty).toBe(false);
    i.fieldSet("repeat")(({ currentTarget: { value: "4" } } as any));
    i.forceUpdate();
    expect(i.state.localCopyDirty).toBe(true);
    expect(i.state.fe.repeat).toEqual("4");
  });

  it("Recombines local state back into a Partial<TaggedFarmEvent[\"body\"]>", () => {
    let result = recombine({
      "startDate": "2017-08-01",
      "startTime": "08:35",
      "endDate": "2017-08-01",
      "endTime": "08:33",
      "repeat": "1",
      "timeUnit": "never",
      "executable_type": "Regimen",
      "executable_id": "1"
    });
    expect(result.start_time).toContain("2017-08-01");
    expect(result.end_time).toContain("2017-08-01");
    expect(result.start_time).toContain(":35:00.000");
    expect(result.end_time).toContain(":33:00.000");
    expect(result.repeat).toBe(1);
    expect(result.time_unit).toBe("never");
    expect(result.executable_id).toBe(1);
    expect(result.executable_type).toBe("Regimen");
  });
});
