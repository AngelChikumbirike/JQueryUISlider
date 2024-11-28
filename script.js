/*Written by Angel Chikumbirike
angelchikumbirike@gmail.com*/

$(document).ready(function () {
    // Initialize jQuery UI tabs
    $("#tabs").tabs();
    // Add a custom validation method to check if start value is less than or equal to the end value
    $.validator.addMethod(
        "startBeforeEnd",
        function (value, element, params) {
            const startValue = parseInt($(params[0]).val());
            const endValue = parseInt($(params[1]).val());

            if (isNaN(startValue) || isNaN(endValue)) {
                return true;
            }
            return startValue <= endValue;
        },
        "Starting number should not exceed the ending number."
    );

    // Initialize sliders with two-way binding
    initializeSlider("#slider-start-horiz", "#start-horiz", -50, 50);
    initializeSlider("#slider-end-horiz", "#end-horiz", -50, 50);
    initializeSlider("#slider-start-vert", "#start-vert", -50, 50);
    initializeSlider("#slider-end-vert", "#end-vert", -50, 50);
    // Form validation and submission
    $("#multiplication-form").validate({
        rules: {
            startHoriz: {
                required: true,
                number: true,
                range: [-50, 50],
                startBeforeEnd: ["#start-horiz", "#end-horiz"]
            },
            endHoriz: {
                required: true,
                number: true,
                range: [-50, 50]
            },
            startVert: {
                required: true,
                number: true,
                range: [-50, 50],
                startBeforeEnd: ["#start-vert", "#end-vert"]
            },
            endVert: {
                required: true,
                number: true,
                range: [-50, 50]
            }
        },
        messages: {
            startHoriz: {
                required: "Starting number (horizontal) is required.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50.",
                startBeforeEnd: "Starting number (horizontal) should not exceed the ending number."
            },
            endHoriz: {
                required: "Ending number (horizontal) is required.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50."
            },
            startVert: {
                required: "Starting number (vertical) is required.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50.",
                startBeforeEnd: "Starting number (vertical) should not exceed the ending number."
            },
            endVert: {
                required: "Ending number (vertical) is required.",
                number: "Please enter a valid number.",
                range: "Value must be between -50 and 50."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass("input-error"); // Add styling class
            error.insertAfter(element); // Place error directly after the field
        },
        submitHandler: function (form) {
            // Generate table and update tabs
            const startHoriz = parseInt($("#start-horiz").val());
            const endHoriz = parseInt($("#end-horiz").val());
            const startVert = parseInt($("#start-vert").val());
            const endVert = parseInt($("#end-vert").val());

            const tableId = `tab-${Date.now()}`;
            const tabTitle = `${startHoriz} to ${endHoriz}, ${startVert} to ${endVert}`;
            const table = generateMultiplicationTable(startHoriz, endHoriz, startVert, endVert);

            $("#tabs").find("ul").append(
                `<li><a href="#${tableId}">${tabTitle}</a> <span class="ui-icon ui-icon-close" role="presentation"></span></li>`
            );
            $("#tabs").append(`<div id="${tableId}" class="tab-content"><div id="table-container">${table[0].outerHTML}</div></div>`);
            $("#tabs").tabs("refresh");
            
            // Add to tab management and enable tab deletion
            addTabToManageList(tableId, tabTitle);

            // Close tab on clicking the close icon
            $(`#tabs li a[href='#${tableId}']`).next(".ui-icon-close").on("click", function () {
                removeTab(tableId);
            });

            // Reset form and sliders
            resetFormAndSliders();
        }
    });
    // Multi-tab deletion
    $("#delete-selected-tabs").on("click", function () {
        $("#tab-list input:checked").each(function () {
            const tabId = $(this).data("tab-id");
            removeTab(tabId);
        });
    });

    function initializeSlider(sliderId, inputId, min, max) {
        $(sliderId).slider({
            range: "min",
            min: min,
            max: max,
            slide: function (event, ui) {
                $(inputId).val(ui.value).trigger("change");
            }
        });

        $(inputId).on("change", function () {
            const value = parseInt($(this).val()) || 0;
            $(sliderId).slider("value", value);
        });
    }

    function generateMultiplicationTable(startHoriz, endHoriz, startVert, endVert) {
        const table = $("<table>");
        const thead = $("<thead>").appendTo(table);
        const tbody = $("<tbody>").appendTo(table);

        const headerRow = $("<tr>").appendTo(thead);
        headerRow.append("<th></th>");
        for (let h = startHoriz; h <= endHoriz; h++) {
            headerRow.append(`<th>${h}</th>`);
        }

        for (let v = startVert; v <= endVert; v++) {
            const row = $("<tr>").appendTo(tbody);
            row.append(`<th>${v}</th>`);
            for (let h = startHoriz; h <= endHoriz; h++) {
                row.append(`<td>${v * h}</td>`);
            }
        }

        return table;
    }

    function addTabToManageList(tabId, tabTitle) {
        const checkbox = `<div><input type="checkbox" data-tab-id="${tabId}" /> ${tabTitle}</div>`;
        $("#tab-list").append(checkbox);
    }

    function removeTab(tabId) {
        $(`#${tabId}`).remove();
        $(`#tabs li a[href='#${tabId}']`).parent().remove();
        $(`#tab-list input[data-tab-id='${tabId}']`).parent().remove();
        $("#tabs").tabs("refresh");
    }

    function resetFormAndSliders() {
        // Reset form inputs
        $("#multiplication-form")[0].reset();

        // Reset sliders to default values
        $("#slider-start-horiz, #slider-end-horiz, #slider-start-vert, #slider-end-vert").each(function () {
            $(this).slider("value", 0); // Set default slider value (e.g., 0)
        });

        // Update input fields to match slider reset
        $("#start-horiz, #end-horiz, #start-vert, #end-vert").val("");
    }
});

